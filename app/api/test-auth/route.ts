import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Auth test successful',
        userId: userId || null,
        isAuthenticated: !!userId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Auth test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
