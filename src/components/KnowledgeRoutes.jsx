import ResourceLanding from './ResourceLanding'
import { NotFoundPage } from './ServiceLanding'
import { publishedResourcePages } from '../data/pageRegistry'

export default function KnowledgeRoutes({path}) {
  const page = publishedResourcePages.find(item => item.path === path)
  return page ? <ResourceLanding page={page}/> : <NotFoundPage/>
}
