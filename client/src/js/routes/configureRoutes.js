import React from "react"
import AppPageMediator from "mediators/AppPageMediator"

import { Route, Switch, Redirect } from "react-router"

function logout(nextState, replaceState) {
  Auth.deauthenticateUser()
  // replaceState(null, '/login');
}

export const ROUTES = {
  root: {
    slug: "/",
  },
  content: {
    slug: "/content",
    label: "Content",
  },
  leadData: {
    slug: "/reports",
    label: "Reports",
  },
  performance: {
    slug: "/performance",
    label: "Performance",
  },
}

export default function configureRoutes() {
  return (
    <Switch>
      <Route
        exact
        path={`${ROUTES.root.slug}`}
        render={() => <Redirect to={ROUTES.content.slug} />}
      />
    </Switch>
  )
}
