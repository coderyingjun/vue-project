import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

const router=new VueRouter({
    mode: 'hash',
    routes: [
        {
            path:'/casedetail',
            name: 'casedetail',
            component:()=>import('@/components/Casedetail'),
            meta: {
                title: '案例预览'
            }
        },
        {
            path: '/',
            name: 'index',
            component:()=>import('@/components/index'),
            meta: {
                title: '首页'
            }
        },
        {
            path: '/login',
            name: 'login',
            component:()=>import('@/components/login'),
            meta: {
                title: '案例库后台登录'
            }
        },
        {
            path: '/index',
            name: 'index',
            component:()=>import('@/components/index'),
            meta: {
                title: '首页',
                needLogin: true
            },
            children:[{
                path: '/',
                component: ()=>import('@/components/main'),
            },{
                path: '/index',
                component: ()=>import('@/components/main'),
            },{
                path: "/usermanage",
                component: ()=>import('@/components/Usermanage')
            },{
                path: "/fieldmanage",
                component: ()=>import('@/components/Fieldmanage')
            }, {
                path: "/subjectmanage",
                component: ()=>import('@/components/Subjectmanage')
            }, {
                path: "/kindmanage",
                component: ()=>import('@/components/Kindmanage')
            }, {
                path: "/noticemanage",
                component: ()=>import('@/components/Noticemanage')
            }, {
                path: "/casemanage",
                component: ()=>import('@/components/Casemanage')
            }, {
                path: "/editCase/:id",
                component: ()=>import('@/components/editor')
            },{
                path: "/addCase",
                component: ()=>import('@/components/main-editor')
            },{
                path: "/rolemanage",
                component: ()=>import('@/components/RoleManage')
            }, {
                path:"/spidertask"  ,
                component: ()=>import('@/components/SpiderTask')
            },{
                path:"/templatemanage"  ,
                component: ()=>import('@/components/TemplateManage')
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