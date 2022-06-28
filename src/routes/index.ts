import { Router } from 'express'
import { readdirSync } from 'fs'
import {Container} from "inversify";

const register = (routePath: string, router: Router, container: Container) => {
    const route = require(`./${routePath}`)
    route.register(router, container)
}

export const registerRoutes = (router, container) => {
    const routes = readdirSync(__dirname).filter(route => /route\../.test(route))
    for (const route of routes) {
        register(route, router, container)
    }
}

