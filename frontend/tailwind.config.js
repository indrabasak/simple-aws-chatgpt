// /** @type {import('tailwindcss').Config} */
// export default {
//     content: ['./src/**/*.{js,jsx,ts,tsx}'],
//     theme: {
//         extend: {
//             fontFamily: {
//                 chat: ['ArtifaktElement', 'sans-serif'],
//             },
//             colors: {
//                 'autodesk-white': '#FFFFFF',
//                 'autodesk-black': '#000000',
//                 'autodesk-purple': '#007bff',
//             },
//             spacing: {
//                 0: '0',
//                 1: '4px',
//                 2: '8px',
//                 3: '12px',
//                 4: '16px',
//                 5: '20px',
//                 6: '24px',
//                 7: '32px',
//                 8: '48px',
//                 9: '64px',
//             },
//         },
//     },
//     plugins: [],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily:{
                'vishal' : ['Poppins'],
                'chat': ['ArtifaktElement', 'sans-serif'],
            },
            screens: {
                'custom': '1614px',
            },
            backgroundSize: {
                '500-auto': '500% auto',
            },
            keyframes: {
                textShine: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '100%': { backgroundPosition: '100% 50%' },
                },
            },
            animation: {
                textShine: 'textShine 5s ease-in-out infinite alternate',
            },
            backgroundImage: {
                'gradient-to-right': 'linear-gradient(to right, #7953cd 20%, #00affa 30%, #0190cd 70%, #764ada 80%)',
            },
        },
    },
    plugins: [],
}