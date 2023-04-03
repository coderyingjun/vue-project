import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const router=new VueRouter({
    mode: 'hash',
    routes: [
        {
            path: '/',
            name: 'index',
            component:()=>import('@/components/main'),
            meta: {
                title: '课程思政案例库'
            },children:[
                {
                    path:'/',
                    component:()=>import('@/components/Index')
                },{
                path:'/search/:type?/:search?',
                component:()=>import('@/components/MainSearch')
            },{
                path:'/casedetail',
                name: 'casedetail',
                component:()=>import('@/components/CaseDetail')
            }, {
                    path:'/notices',
                    component:()=>import('@/components/Notice')
                },{
                path:'/mycollection',
                component:()=>import('@/components/MyCollection')
            },{
                path:'/mycases',
                component:()=>import('@/components/MyCase')
            },{
                path:'/addcases',
                component:()=>import('@/components/AddEditor')
            },{
                path:'/editCase/:id',
                component:()=>import('@/components/CaseEditor')
            }
            ]
        },{
            path: '/index',
            name: 'index',
            component:()=>import('@/components/main'),
            meta: {
                title: '课程思政案例库'
            },
            children:[{
                path:'/',
                component:()=>import('@/components/MainSearch')
            }
            ]
        }
    ]
})
router.beforeEach((to,from,next)=>{
    document.title=to.matched[0].meta.title
    next()
})
export default router