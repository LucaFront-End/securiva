import test from 'node:test'
import assert from 'node:assert/strict'
import { getRouteAssets } from '../scripts/route-assets.mjs'

function manifestFixture() {
  return {
    'index.html':{file:'assets/index.js',isEntry:true,imports:['_runtime.js'],dynamicImports:['_HomePage-hash.js','src/components/KnowledgeRoutes.jsx','src/components/ServiceRoutes.jsx'],css:['assets/index.css']},
    '_runtime.js':{file:'assets/runtime.js',css:['assets/runtime.css']},
    '_HomePage-hash.js':{file:'assets/home.js',name:'HomePage',isDynamicEntry:true,imports:['index.html'],dynamicImports:['src/components/ThreeScene.jsx'],css:['assets/home.css']},
    'src/components/KnowledgeRoutes.jsx':{file:'assets/knowledge.js',name:'KnowledgeRoutes',isDynamicEntry:true,imports:['index.html','_knowledge-ui.js'],css:['assets/knowledge.css']},
    '_knowledge-ui.js':{file:'assets/knowledge-ui.js',imports:['_runtime.js'],css:['assets/knowledge-ui.css']},
    'src/components/ServiceRoutes.jsx':{file:'assets/services.js',name:'ServiceRoutes',isDynamicEntry:true,imports:['index.html'],css:['assets/services.css']},
    'src/components/ThreeScene.jsx':{file:'assets/three.js',name:'ThreeScene',isDynamicEntry:true,imports:['_heavy-renderer.js'],css:['assets/three.css']},
    '_heavy-renderer.js':{file:'assets/heavy-renderer.js'},
  }
}

test('home gets root and active home styles without eagerly loading nested 3D scenes',()=>{
  const assets=getRouteAssets('/',manifestFixture())
  assert.deepEqual(assets.css,['assets/runtime.css','assets/index.css','assets/home.css'])
  assert.deepEqual(assets.js,['assets/runtime.js','assets/index.js','assets/home.js'])
  assert.ok(!assets.js.some(file=>file.includes('three')||file.includes('heavy')||file.includes('knowledge')||file.includes('services')))
})

test('knowledge paths include their static imports and exclude home, services and dynamic scenes',()=>{
  for(const path of ['/blog','/blog/un-articulo','/recursos','/recursos/checklist','/preparar-pentest','/sobre-securiva','/informe-pentest-ejemplo']) {
    const assets=getRouteAssets(path,manifestFixture())
    assert.deepEqual(assets.css,['assets/runtime.css','assets/index.css','assets/knowledge-ui.css','assets/knowledge.css'],path)
    assert.deepEqual(assets.js,['assets/runtime.js','assets/index.js','assets/knowledge-ui.js','assets/knowledge.js'],path)
  }
  const manifest=manifestFixture()
  delete manifest['src/components/ThreeScene.jsx']
  delete manifest['_heavy-renderer.js']
  assert.doesNotThrow(()=>getRouteAssets('/blog',manifest),'Unvisited lazy scene entries are not required for this route.')
})

test('published service and country paths resolve only the service entry',()=>{
  for(const path of ['/pentesting-web','/seguridad-api','/argentina','/mexico','/pentesting-saas']) {
    const assets=getRouteAssets(path,manifestFixture())
    assert.deepEqual(assets.css,['assets/runtime.css','assets/index.css','assets/services.css'],path)
    assert.deepEqual(assets.js,['assets/runtime.js','assets/index.js','assets/services.js'],path)
  }
})

test('hashed entry keys and source filenames both identify first-level route chunks',()=>{
  const manifest=manifestFixture()
  delete manifest['src/components/KnowledgeRoutes.jsx'].name
  assert.ok(getRouteAssets('/blog',manifest).js.includes('assets/knowledge.js'))
  delete manifest['_HomePage-hash.js'].name
  manifest['_HomePage-hash.js'].src='src/HomePage.jsx'
  assert.ok(getRouteAssets('/',manifest).js.includes('assets/home.js'))
  manifest['_nested-home.js']={file:'assets/nested-home.js',name:'HomePage',isDynamicEntry:true}
  assert.ok(!getRouteAssets('/',manifest).js.includes('assets/nested-home.js'),'A same-named nested dynamic entry cannot replace the first-level route.')
})

test('cycles and repeated CSS or aliased asset files never produce duplicate links',()=>{
  const manifest=manifestFixture()
  manifest['_runtime.js'].imports=['index.html']
  manifest['_runtime.js'].css.push('assets/index.css')
  manifest['src/components/KnowledgeRoutes.jsx'].imports.push('_alias.js')
  manifest['_alias.js']={file:'assets/knowledge-ui.js',css:['assets/knowledge-ui.css']}
  const assets=getRouteAssets('/blog',manifest)
  assert.equal(new Set(assets.css).size,assets.css.length)
  assert.equal(new Set(assets.js).size,assets.js.length)
  assert.equal(assets.css.filter(file=>file==='assets/index.css').length,1)
  assert.equal(assets.js.filter(file=>file==='assets/knowledge-ui.js').length,1)
})

test('missing or ambiguous required entries and malformed asset lists fail the build',()=>{
  for(const key of ['index.html','_runtime.js','_knowledge-ui.js','src/components/KnowledgeRoutes.jsx']) {
    const manifest=manifestFixture()
    delete manifest[key]
    assert.throws(()=>getRouteAssets('/blog',manifest),key)
  }
  let manifest=manifestFixture()
  manifest['_extra-knowledge.js']={file:'assets/extra.js',name:'KnowledgeRoutes',isDynamicEntry:true}
  manifest['index.html'].dynamicImports.push('_extra-knowledge.js')
  assert.throws(()=>getRouteAssets('/blog',manifest))
  manifest=manifestFixture()
  manifest['src/components/KnowledgeRoutes.jsx'].css='assets/knowledge.css'
  assert.throws(()=>getRouteAssets('/blog',manifest))
  manifest=manifestFixture()
  manifest['src/components/KnowledgeRoutes.jsx'].imports=[null]
  assert.throws(()=>getRouteAssets('/blog',manifest))
  for(const file of ['https://other.example/a.js','/assets/a.js','../outside.js','assets/a.js?x=1','assets/a\".js','assets/a.woff2']) {
    manifest=manifestFixture()
    manifest['src/components/KnowledgeRoutes.jsx'].file=file
    assert.throws(()=>getRouteAssets('/blog',manifest),file)
  }
  assert.throws(()=>getRouteAssets('/blog',null))
  assert.throws(()=>getRouteAssets('https://example.org/blog',manifestFixture()))
})
