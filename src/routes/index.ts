import { Router } from 'express'
import { readdirSync } from 'fs'

const register = (routePath: string, router: Router) => {
    const route = require(`./${routePath}`)
    route.register(router)
}

export const registerRoutes = (router: Router) => {
    const routes = readdirSync(__dirname).filter(route => /route\../.test(route))
    for (const route of routes) {
        register(route, router)
    }
}

