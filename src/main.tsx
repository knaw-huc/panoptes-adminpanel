import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css'
import './index.scss'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {MantineProvider} from "@mantine/core";
import {Notifications} from "@mantine/notifications";

const queryClient = new QueryClient()

// Set up a Router instance
const router = createRouter({
    routeTree,
    context: {
        queryClient: queryClient,
        tenant: undefined!
    },
    defaultPreload: 'intent',
    defaultStaleTime: 5000,
    scrollRestoration: true,
})

// Register things for typesafety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const rootElement = document.getElementById('app')!

function App() {
    return <QueryClientProvider client={queryClient}>
        <MantineProvider>
            <Notifications />
            <RouterProvider router={router} />
        </MantineProvider>
    </QueryClientProvider>
}

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <App />
    )
}
