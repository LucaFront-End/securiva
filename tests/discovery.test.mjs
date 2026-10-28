import test from 'node:test'
import assert from 'node:assert/strict'
import { blogPosts } from '../src/data/blog.js'
import { CONTENT_MANIFEST_PATH, DISCOVERY_FEED_PATH, getContentLastmod, getContentManifest, renderBlogFeed } from '../src/seo/discovery.js'

const origin='https://securiva.vercel.app'
const dateOptions={now:new Date('2026-10-28T12:00:00.000Z')}
const article={path:'/blog/seguridad-y-datos',title:'APIs & datos <privados>',emphasis:'"Permisos" con criterio.',description:'Permisos > confianza & evidencia.',summary:'Una guía sobre APIs y autorización.',category:'APIs',updatedAt:'2026-10-28',references:[{label:'OWASP & APIs',url:'https://owasp.org/www-project-api-security/'}],faq:[{question:'¿Qué se valida?',answer:'El alcance y la evidencia.'}]}

test('RSS provides stable canonical permalinks, XML-safe text and a self link',()=>{
  const feed=renderBlogFeed(origin,[{...article,publishedAt:'2026-10-27'}],dateOptions)
  assert.ok(feed.startsWith('<?xml version="1.0" encoding="UTF-8"?>'))
  assert.ok(feed.includes('<rss version="2.0"'))
  assert.equal((feed.match(/<item>/g)||[]).length,1)
  assert.ok(feed.includes('APIs &amp; datos &lt;privados&gt; &quot;Permisos&quot; con criterio.'))
  assert.ok(feed.includes('<guid isPermaLink="true">https://securiva.vercel.app/blog/seguridad-y-datos</guid>'))
  assert.ok(feed.includes('<pubDate>Tue, 27 Oct 2026 00:00:00 GMT</pubDate>'))
  assert.ok(feed.includes('<lastBuildDate>Wed, 28 Oct 2026 00:00:00 GMT</lastBuildDate>'))
  assert.ok(feed.includes(`href="${origin}${DISCOVERY_FEED_PATH}" rel="self"`))
  assert.ok(!feed.includes('<author>'))
})

test('modification and publication dates never fall back to the build clock',()=>{
  const noPublication=renderBlogFeed(origin,[article],dateOptions)
  assert.ok(!noPublication.includes('<pubDate>'))
  const undated={...article,updatedAt:undefined}
  const feed=renderBlogFeed(origin,[undated],dateOptions)
  assert.ok(!feed.includes('<pubDate>')&&!feed.includes('<lastBuildDate>'))
  assert.equal(getContentLastmod(undated,dateOptions),undefined)
  assert.equal(getContentLastmod({updatedAt:'2024-02-29'},dateOptions),'2024-02-29')
  for(const value of ['2026-02-30','2026-13-01','28/10/2026','2026-10-28T12:00:00Z','2026-10-29']) {
    assert.throws(()=>getContentLastmod({updatedAt:value},dateOptions),value)
  }
  assert.throws(()=>renderBlogFeed(origin,[{...article,publishedAt:'2026-10-28',updatedAt:'2026-10-27'}],dateOptions))
})

test('drafts are omitted, but duplicate or unsafe canonical URLs fail closed',()=>{
  const feed=renderBlogFeed(origin,[article,{...article,path:'/blog/borrador',published:false},{...article,path:'/blog/no-index',indexable:false}],dateOptions)
  assert.equal((feed.match(/<item>/g)||[]).length,1)
  assert.ok(!feed.includes('/blog/borrador')&&!feed.includes('/blog/no-index'))
  assert.throws(()=>renderBlogFeed(origin,[article,article],dateOptions))
  for(const path of ['https://other.example/blog/a','//other.example/blog/a','/blog/../argentina','/blog/a?source=feed','/blog/a#evidencia','/blog\\a','/pentesting-web']) {
    assert.throws(()=>renderBlogFeed(origin,[{...article,path}],dateOptions),path)
  }
  for(const value of ['http://example.org','https://example.org/path','https://user:pass@example.org','https://example.org/?secret=a','https://localhost']) {
    assert.throws(()=>renderBlogFeed(value,[article],dateOptions),value)
  }
})

test('public manifest includes only declared content and valid HTTPS references',()=>{
  const manifest=getContentManifest(origin,[article,{...article,path:'/blog/draft',published:false}],dateOptions)
  assert.equal(CONTENT_MANIFEST_PATH,'/content-index.json')
  assert.equal(manifest.items.length,1)
  assert.equal(manifest.items[0].dateModified,'2026-10-28')
  assert.ok(!Object.hasOwn(manifest.items[0],'datePublished'))
  assert.equal(manifest.items[0].questions[0].answer,'El alcance y la evidencia.')
  assert.equal(manifest.items[0].references[0].url,'https://owasp.org/www-project-api-security/')
  assert.equal(manifest.author.url,`${origin}/sobre-securiva#luca-dessena-maffucci`)
  assert.throws(()=>getContentManifest(origin,[{...article,references:[{label:'Unsafe',url:'javascript:alert(1)'}]}],dateOptions))
  assert.throws(()=>renderBlogFeed(origin,[{...article,title:'Bad\u0000title'}],dateOptions))
})

test('the complete editorial collection is deterministic and every article is discoverable',()=>{
  const now=new Date()
  const later=new Date(now)
  later.setUTCFullYear(now.getUTCFullYear()+1)
  const feed=renderBlogFeed(origin,blogPosts,{now})
  const manifest=getContentManifest(origin,blogPosts,{now})
  assert.equal((feed.match(/<item>/g)||[]).length,blogPosts.length)
  assert.equal(manifest.items.length,blogPosts.length)
  assert.equal(new Set(manifest.items.map(item=>item.url)).size,blogPosts.length)
  for(const post of blogPosts) assert.ok(feed.includes(`${origin}${post.path}`),post.path)
  assert.equal(feed,renderBlogFeed(origin,blogPosts,{now:later}))
  assert.ok(manifest.items.every(item=>item.references.length>0&&item.questions.length>0))
})
