module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/apps/web/src/app/auth/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuthPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@15.5.5+dfc90389513bb65c/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@15.5.5+dfc90389513bb65c/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function AuthPage() {
    const [isLogin, setIsLogin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const activeBackground = "#DCE9FB"; // culoarea fundalului activ
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: "390px",
            height: "844px",
            borderRadius: "40px",
            background: "#FFF",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: "40px",
            margin: "0 auto",
            position: "relative"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                style: {
                    width: isLogin ? "auto" : "339px",
                    textAlign: "center",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: isLogin ? "26.163px" : "26.716px",
                    fontWeight: isLogin ? 700 : 600,
                    lineHeight: isLogin ? "148.687%" : "30px",
                    letterSpacing: isLogin ? "0.785px" : "0.534px",
                    background: "linear-gradient(180deg, #0C3057 0%, #31649A 60.1%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "20px"
                },
                children: isLogin ? "Welcome to Skill Trade" : "Create your account"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/auth/page.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            isLogin ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    width: "277.326px",
                    color: "#000",
                    textAlign: "center",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "15.698px",
                    fontWeight: 400,
                    lineHeight: "normal",
                    marginBottom: "20px"
                },
                children: "Login or Sign up to access your account"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/auth/page.tsx",
                lineNumber: 47,
                columnNumber: 3
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: "277.326px",
                    height: "20px",
                    marginBottom: "20px"
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/auth/page.tsx",
                lineNumber: 62,
                columnNumber: 3
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    width: "100%"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsLogin(true),
                        style: {
                            width: "50%",
                            height: "48px",
                            borderRadius: "0 8.721px 0 0",
                            background: isLogin ? activeBackground : "#FFF",
                            color: "#000",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "19.186px",
                            fontWeight: 600,
                            border: "none",
                            cursor: "pointer"
                        },
                        children: "Login"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/auth/page.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsLogin(false),
                        style: {
                            width: "50%",
                            height: "48px",
                            borderRadius: "8.721px 0 0 0",
                            background: !isLogin ? activeBackground : "#FFF",
                            color: "#000",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "19.186px",
                            fontWeight: 600,
                            border: "none",
                            cursor: "pointer"
                        },
                        children: "Sign Up"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/auth/page.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/auth/page.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: "100%",
                    flex: 1,
                    background: activeBackground,
                    borderRadius: "0 0 40px 40px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "20px",
                    marginTop: "0"
                },
                children: isLogin ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: "121px",
                                height: "18.729px",
                                color: "#000",
                                textAlign: "center",
                                fontFamily: "Work Sans, sans-serif",
                                fontSize: "15px",
                                fontStyle: "normal",
                                fontWeight: 400,
                                lineHeight: "normal",
                                opacity: 0.5,
                                marginBottom: "5px"
                            }
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/auth/page.tsx",
                            lineNumber: 123,
                            columnNumber: 1
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "email",
                            placeholder: "Email Address",
                            style: {
                                width: "322.674px",
                                height: "49px",
                                borderRadius: "8.721px",
                                border: "0.5px solid #6F6F6F",
                                background: "#FFF",
                                boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
                                marginBottom: "10px",
                                padding: "10px",
                                fontSize: "1rem"
                            }
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/auth/page.tsx",
                            lineNumber: 142,
                            columnNumber: 1
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: "relative",
                                width: "322.674px",
                                height: "51.558px",
                                margin: "10px 0"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: showPassword ? "text" : "password",
                                    placeholder: "Password",
                                    style: {
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "8.721px",
                                        border: "0.5px solid #323232",
                                        background: "#FFF",
                                        padding: "10px",
                                        fontFamily: "Work Sans, sans-serif",
                                        fontSize: "15px",
                                        color: "#000",
                                        boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                                        boxSizing: "border-box"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/auth/page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 3
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: ()=>setShowPassword(!showPassword),
                                    style: {
                                        position: "absolute",
                                        right: "10px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        width: "21.802px",
                                        height: "14.322px",
                                        cursor: "pointer"
                                    },
                                    dangerouslySetInnerHTML: {
                                        __html: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="15" viewBox="0 0 22 15" fill="none">
<path opacity="0.3" d="M10.9014 0.25C14.0035 0.250051 16.8198 1.41018 19.0527 3.61035C20.313 4.8521 21.0522 6.09177 21.3535 6.65723L21.5117 6.97363C21.5385 7.03298 21.5527 7.09743 21.5527 7.16211C21.5527 7.22661 21.5384 7.29042 21.5117 7.34961V7.35059C21.484 7.41205 20.7297 9.0595 19.0527 10.7119C16.8198 12.9112 14.0035 14.0712 10.9014 14.0713C7.7992 14.0713 4.98299 12.9112 2.75 10.7119C1.07431 9.0608 0.319851 7.41456 0.291016 7.35059V7.34961C0.264293 7.29038 0.250051 7.22666 0.25 7.16211C0.25 7.09743 0.264238 7.03298 0.291016 6.97363L0.293945 6.9668C0.293966 6.96677 0.296652 6.9596 0.303711 6.94434C0.310599 6.92945 0.320118 6.90834 0.333008 6.88184C0.358871 6.82867 0.397139 6.75336 0.447266 6.65918C0.547553 6.47077 0.697211 6.20736 0.898438 5.89355C1.3013 5.2653 1.91064 4.4374 2.75 3.61035C4.98296 1.41026 7.79927 0.25 10.9014 0.25ZM12.3857 3.62109C11.6768 3.33186 10.8969 3.25689 10.1445 3.4043C9.39187 3.55182 8.69963 3.91576 8.15625 4.45117C7.61287 4.98661 7.24193 5.66938 7.0918 6.41309C6.94173 7.15676 7.0191 7.92765 7.31348 8.62793C7.60788 9.32826 8.1065 9.92623 8.74512 10.3467C9.38366 10.767 10.1341 10.9912 10.9014 10.9912C11.9301 10.9912 12.9179 10.589 13.6465 9.87109C14.3752 9.15311 14.7851 8.17812 14.7852 7.16113C14.7852 6.40277 14.557 5.66122 14.1299 5.03125C13.7027 4.4013 13.095 3.91056 12.3857 3.62109Z" fill="black" stroke="#323232" stroke-width="0.5"/>
</svg>`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/auth/page.tsx",
                                    lineNumber: 178,
                                    columnNumber: 3
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/auth/page.tsx",
                            lineNumber: 157,
                            columnNumber: 4
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: "323px",
                                margin: "20px auto 0"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "/forgot-password",
                                    style: {
                                        display: "block",
                                        color: "#000",
                                        fontFamily: "Poppins, sans-serif",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        lineHeight: "normal",
                                        textDecoration: "none",
                                        marginBottom: "10px",
                                        textAlign: "left"
                                    },
                                    children: "Forgot password?"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/auth/page.tsx",
                                    lineNumber: 199,
                                    columnNumber: 3
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    style: {
                                        width: "100%",
                                        height: "50px",
                                        borderRadius: "8.721px",
                                        border: "0.5px solid #6F6F6F",
                                        background: "#6085B9",
                                        color: "#FFF",
                                        fontFamily: "Poppins, sans-serif",
                                        fontSize: "16px",
                                        fontWeight: 700,
                                        lineHeight: "normal",
                                        textAlign: "center",
                                        boxShadow: "0 0 0 6.977px rgba(255, 255, 255, 0.15)",
                                        cursor: "pointer"
                                    },
                                    children: "Login"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/auth/page.tsx",
                                    lineNumber: 216,
                                    columnNumber: 3
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/auth/page.tsx",
                            lineNumber: 198,
                            columnNumber: 1
                        }, this)
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: "322px",
                                marginTop: "20px"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: "16px",
                                        fontFamily: "Poppins",
                                        color: "#6F6F6F",
                                        marginBottom: "5px"
                                    },
                                    children: "Name"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/auth/page.tsx",
                                    lineNumber: 243,
                                    columnNumber: 5
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "",
                                    style: {
                                        width: "100%",
                                        height: "38.267px",
                                        padding: "0 176px 0 15px",
                                        borderRadius: "10px",
                                        border: "0.5px solid #6F6F6F",
                                        background: "#FFF",
                                        boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        flexShrink: 0
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/auth/page.tsx",
                                    lineNumber: 246,
                                    columnNumber: 5
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: "16px",
                                        fontFamily: "Poppins",
                                        color: "#6F6F6F",
                                        margin: "20px 0 5px 0"
                                    },
                                    children: "Email"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/auth/page.tsx",
                                    lineNumber: 264,
                                    columnNumber: 5
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "email",
                                    placeholder: "",
                                    style: {
                                        width: "100%",
                                        height: "38.267px",
                                        borderRadius: "10px",
                                        border: "0.5px solid #6F6F6F",
                                        background: "#FFF",
                                        boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
                                        padding: "0 15px"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/auth/page.tsx",
                                    lineNumber: 267,
                                    columnNumber: 5
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: "16px",
                                        fontFamily: "Poppins",
                                        color: "#6F6F6F",
                                        margin: "20px 0 5px 0"
                                    },
                                    children: "Password"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/auth/page.tsx",
                                    lineNumber: 270,
                                    columnNumber: 5
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    placeholder: "",
                                    style: {
                                        width: "100%",
                                        height: "38.267px",
                                        borderRadius: "10px",
                                        border: "0.5px solid #6F6F6F",
                                        background: "#FFF",
                                        boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
                                        padding: "0 15px"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/auth/page.tsx",
                                    lineNumber: 273,
                                    columnNumber: 5
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: "16px",
                                        fontFamily: "Poppins",
                                        color: "#6F6F6F",
                                        margin: "20px 0 5px 0"
                                    },
                                    children: "Confirm Password"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/auth/page.tsx",
                                    lineNumber: 276,
                                    columnNumber: 5
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "password",
                                    placeholder: "",
                                    style: {
                                        width: "100%",
                                        height: "38.267px",
                                        borderRadius: "10px",
                                        border: "0.5px solid #6F6F6F",
                                        background: "#FFF",
                                        boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)",
                                        padding: "0 15px"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/auth/page.tsx",
                                    lineNumber: 279,
                                    columnNumber: 5
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    style: {
                                        display: "flex",
                                        width: "288px",
                                        height: "46px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexShrink: 0,
                                        borderRadius: "10px",
                                        border: "0.5px solid #6F6F6F",
                                        background: "#6085B9",
                                        boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
                                        color: "#FFF",
                                        fontFamily: "Poppins, sans-serif",
                                        fontSize: "16px",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        position: "absolute",
                                        left: "50%",
                                        top: "600px",
                                        transform: "translateX(-50%)" // centrează perfect
                                    },
                                    children: "Sign Up"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/auth/page.tsx",
                                    lineNumber: 282,
                                    columnNumber: 3
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: "absolute",
                                        bottom: "20px",
                                        left: "48%",
                                        transform: "translateX(-50%)",
                                        textAlign: "center",
                                        fontFamily: "Poppins, sans-serif",
                                        fontSize: "16px",
                                        fontWeight: 400,
                                        lineHeight: "49.849px",
                                        letterSpacing: "0.25px",
                                        color: "#888"
                                    },
                                    children: [
                                        "Have an account?",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$15$2e$5$2e$5$2b$dfc90389513bb65c$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "#",
                                            onClick: ()=>setIsLogin(true),
                                            style: {
                                                color: "#6085B9",
                                                fontWeight: 600,
                                                textDecoration: "none",
                                                marginLeft: "5px",
                                                cursor: "pointer"
                                            },
                                            children: "SIGN IN"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/auth/page.tsx",
                                            lineNumber: 325,
                                            columnNumber: 3
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/auth/page.tsx",
                                    lineNumber: 309,
                                    columnNumber: 1
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/auth/page.tsx",
                            lineNumber: 241,
                            columnNumber: 3
                        }, this)
                    }, void 0, false)
                }, void 0, false)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/auth/page.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/auth/page.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/.bun/next@15.5.5+dfc90389513bb65c/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/.bun/next@15.5.5+dfc90389513bb65c/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/.bun/next@15.5.5+dfc90389513bb65c/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/.bun/next@15.5.5+dfc90389513bb65c/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/.bun/next@15.5.5+dfc90389513bb65c/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__09ef8921._.js.map