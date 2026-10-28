import test from 'node:test'
import assert from 'node:assert/strict'
import { seoPages } from '../src/data/seoPages.js'
import { plannedRegionalPages, regionalHubs, regionalServiceIntents, regionalPublicationGates, canPublishRegionalPage } from '../src/data/regionalSeo.js'

test('regional plan covers 25 cities per country and four distinct service intents per city', () => {
  assert.equal(plannedRegionalPages.length,200)
  assert.equal(new Set(plannedRegionalPages.map(page => page.path)).size,200)
  assert.deepEqual(new Set(plannedRegionalPages.map(page => page.countryCode)),new Set(['AR','MX']))
  const serviceKeys = new Set(regionalServiceIntents.map(service => service.key))
  assert.equal(serviceKeys.size,4)
  for (const countryCode of ['AR','MX']) {
    const countryPages = plannedRegionalPages.filter(page => page.countryCode === countryCode)
    assert.equal(countryPages.length,100)
    const cities = new Set(countryPages.map(page => page.citySlug))
    assert.equal(cities.size,25)
    for (const city of cities) {
      const cityPages = countryPages.filter(page => page.citySlug === city)
      assert.equal(cityPages.length,4)
      assert.deepEqual(new Set(cityPages.map(page => page.serviceKey)),serviceKeys)
    }
  }
})

test('unreviewed city briefs stay unpublished, outside the production page registry and without local office claims', () => {
  const publishedPaths = new Set(seoPages.map(page => page.path))
  for (const page of plannedRegionalPages) {
    assert.equal(page.published,false,page.path)
    assert.equal(page.indexable,false,page.path)
    assert.equal(page.status,'editorial-brief',page.path)
    assert.equal(page.deliveryMode,'remote',page.path)
    assert.equal(page.physicalOffice,false,page.path)
    assert.equal(publishedPaths.has(page.path),false,page.path)
    assert.equal(canPublishRegionalPage(page.publicationReview),false,page.path)
    assert.ok(page.editorialBrief.evidenceRequired.length > 30,page.path)
    assert.ok(page.editorialBrief.originalArtifact.length > 30,page.path)
  }
})

test('publication review cannot pass with any missing evidence or unfinished editorial prerequisite', () => {
  const completeReview = Object.fromEntries(regionalPublicationGates.map(gate => [gate,true]))
  assert.equal(canPublishRegionalPage(),false)
  assert.equal(canPublishRegionalPage({}),false)
  assert.equal(canPublishRegionalPage(completeReview),true)
  for (const gate of regionalPublicationGates) {
    const missing = {...completeReview}
    delete missing[gate]
    assert.equal(canPublishRegionalPage(missing),false,`${gate} is missing`)
    for (const incomplete of [false,null,0,'true']) {
      assert.equal(canPublishRegionalPage({...completeReview,[gate]:incomplete}),false,`${gate}: ${incomplete}`)
    }
  }
})

test('country hubs provide distinct content and valid parent paths for every editorial brief', () => {
  assert.equal(regionalHubs.length,2)
  assert.notEqual(regionalHubs[0].summary,regionalHubs[1].summary)
  assert.notDeepEqual(regionalHubs[0].topics,regionalHubs[1].topics)
  for (const hub of regionalHubs) {
    assert.equal(hub.cities.length,25)
    assert.equal(hub.language,hub.countryCode === 'AR' ? 'es-AR' : 'es-MX')
    const children = plannedRegionalPages.filter(page => page.countryPath === hub.path)
    assert.equal(children.length,100)
    for (const page of children) {
      assert.ok(page.path.startsWith(`${hub.path}/${page.citySlug}/`),page.path)
      assert.ok(/^[a-z0-9/-]+$/.test(page.path),page.path)
      assert.equal(page.countryCode,hub.countryCode,page.path)
    }
  }
})
