import CryptoJS from 'crypto-js';
import { NextResponse } from "next/server";

// 请求地址根据语种不同变化
const url = process.env.XFYUN_RTASR_URL;
const appId = process.env.XFYUN_APPID!;
const secretKey = process.env.XFYUN_RTASR_SECRET_KEY!;

export async function POST(req: Request) {
    const ts = Math.floor(new Date().getTime() / 1000);
    // calculate md5 using CryptoJS
    const signa = CryptoJS.MD5(appId + ts).toString();
    const signatureSha = CryptoJS.HmacSHA1(signa, secretKey);
    let signature = CryptoJS.enc.Base64.stringify(signatureSha);
    signature = encodeURIComponent(signature);
    const result =  `${url}?appid=${appId}&ts=${ts}&signa=${signature}`;
    return NextResponse.json({result}, {status:200});
}