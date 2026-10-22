import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css'
import '@mantine/code-highlight/styles.css';
import './index.scss'
import ReactDOM from 'react-dom/client'
import {createRouter, RouterProvider} from '@tanstack/react-router'
import {routeTree} from './routeTree.gen'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {MantineProvider} from "@mantine/core";
import {Notifications} from "@mantine/notifications";
import {CodeHighlightAdapterProvider, createShikiAdapter} from "@mantine/code-highlight";

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

// Shiki requires async code to load the highlighter
async function loadShiki() {
    const { createHighlighter } = await import('shiki');
    return await createHighlighter({
        langs: ['tsx', 'scss', 'html', 'bash', 'json'],
        // You can load supported themes here
        themes: [],
    });
}

const shikiAdapter = createShikiAdapter(loadShiki);

function App() {
    return <QueryClientProvider client={queryClient}>
        <MantineProvider>
            <CodeHighlightAdapterProvider adapter={shikiAdapter}>
                <Notifications />
                <RouterProvider router={router} />
            </CodeHighlightAdapterProvider>
        </MantineProvider>
    </QueryClientProvider>
}

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <App />
    )
}
