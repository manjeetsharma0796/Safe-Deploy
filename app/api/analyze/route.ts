import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { code } = await req.json()

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API Key not configured' },
                { status: 500 }
            )
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

        const prompt = `
        You are an expert Solidity Smart Contract Auditor for the Mantle Network.
        Analyze the following Solidity code for gas optimizations, security vulnerabilities, and best practices.
        
        Focus on:
        1. Gas efficiency (Mantle/L2 context).
        2. Security flaws (Reentrancy, etc).
        3. Code quality.

        Return a JSON array of objects with this structure (do not use markdown code blocks, just raw JSON):
        [
            {
                "title": "Short Title",
                "description": "Concise explanation of the issue and fix.",
                "impact": "High" | "Medium" | "Low"
            }
        ]

        Code:
        ${code}
        `

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        // Clean markdown code blocks if present
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim()

        try {
            const suggestions = JSON.parse(jsonString)
            return NextResponse.json({ suggestions })
        } catch (e) {
            console.error("JSON Parsing Error", e)
            return NextResponse.json({
                suggestions: [{
                    title: 'Analysis Error',
                    description: 'Failed to parse AI response. Please try again.',
                    impact: 'Low'
                }]
            })
        }

    } catch (error) {
        console.error('AI Analysis Error:', error)
        return NextResponse.json(
            { error: 'Failed to analyze code' },
            { status: 500 }
        )
    }
}
