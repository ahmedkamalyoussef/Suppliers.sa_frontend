// import { NextRequest, NextResponse } from "next/server";
// import { API_BASE_URL } from "../../../../lib/config";

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { email, password } = body;

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // Forward the request to the backend API
//     const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     const responseData = await response.json();

//     if (!response.ok) {
//       // Handle specific error cases from backend
//       if (response.status === 404) {
//         return NextResponse.json(
//           { error: responseData.message || "User not found" },
//           { status: 404 }
//         );
//       }

//       if (response.status === 403) {
//         return NextResponse.json(
//           { error: responseData.message || "Email not verified" },
//           { status: 403 }
//         );
//       }

//       if (response.status === 401) {
//         return NextResponse.json(
//           { error: responseData.message || "Invalid credentials" },
//           { status: 401 }
//         );
//       }

//       return NextResponse.json(
//         { error: responseData.message || "Authentication failed" },
//         { status: response.status }
//       );
//     }

//     return NextResponse.json(responseData);
//   } catch (error: any) {
//     console.error("Login API error:", error);

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
