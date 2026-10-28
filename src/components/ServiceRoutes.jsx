import ServiceLanding from './ServiceLanding'
import NotFoundPage from './NotFoundPage'
import { servicePages } from '../data/seoPages'
import { regionalHubs } from '../data/regionalSeo'
import { sectorPages } from '../data/sectorPages'

export default function ServiceRoutes({path}) {
  const page=[...servicePages,...regionalHubs,...sectorPages].find(item=>item.path===path)
  return page ? <ServiceLanding page={page}/> : <NotFoundPage/>
}
