import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
    uri: "https://harrisburg.stepzen.net/api/fun-dragon/__graphql",
    headers: {
        Authorization: `Apikey ${process.env.NEXT_PUBLIC_STEPZEN_KEY} `,
    },
    cache: new InMemoryCache(),
});

// export const emailClient = new ApolloClient({
//     uri: `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
//     headers: {
//         Authorization: `Apikey ${process.env.NEXT_PUBLIC_SUPABASE_API_KEY} `,
//     },
//     cache: new InMemoryCache(),
// });
