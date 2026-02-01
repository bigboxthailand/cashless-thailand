/**
 * AI Rate Limiting Helper
 * 
 * This module provides functions to check and enforce AI message limits
 * - 120 messages per user per day
 * - Resets at midnight (00:00) Thailand time
 */

import { supabase } from './supabase';

const AI_DAILY_LIMIT = 120;

/**
 * Check if user can receive AI responses
 * @param {string} userId - User ID
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<{allowed: boolean, current_count: number, limit: number, remaining: number, reset_at: string}>}
 */
export async function checkAILimit(userId, conversationId) {
    try {
        const { data, error } = await supabase.rpc('check_ai_limit', {
            p_user_id: userId,
            p_conversation_id: conversationId
        });

        if (error) {
            console.error('Error checking AI limit:', error);
            // On error, allow by default (fail open)
            return {
                allowed: true,
                current_count: 0,
                limit: AI_DAILY_LIMIT,
                remaining: AI_DAILY_LIMIT,
                reset_at: getNextMidnight()
            };
        }

        return data;
    } catch (err) {
        console.error('Exception in checkAILimit:', err);
        return {
            allowed: true,
            current_count: 0,
            limit: AI_DAILY_LIMIT,
            remaining: AI_DAILY_LIMIT,
            reset_at: getNextMidnight()
        };
    }
}

/**
 * Increment AI usage counter after bot responds
 * @param {string} userId - User ID
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<{success: boolean, current_count: number, limit: number, remaining: number, limit_reached: boolean}>}
 */
export async function incrementAIUsage(userId, conversationId) {
    try {
        const { data, error } = await supabase.rpc('increment_ai_usage', {
            p_user_id: userId,
            p_conversation_id: conversationId
        });

        if (error) {
            console.error('Error incrementing AI usage:', error);
            return {
                success: false,
                current_count: 0,
                limit: AI_DAILY_LIMIT,
                remaining: AI_DAILY_LIMIT,
                limit_reached: false
            };
        }

        return data;
    } catch (err) {
        console.error('Exception in incrementAIUsage:', err);
        return {
            success: false,
            current_count: 0,
            limit: AI_DAILY_LIMIT,
            remaining: AI_DAILY_LIMIT,
            limit_reached: false
        };
    }
}

/**
 * Get user's AI usage statistics
 * @param {string} userId - User ID
 * @returns {Promise<Array>}
 */
export async function getAIUsageStats(userId) {
    try {
        const { data, error } = await supabase.rpc('get_ai_usage_stats', {
            p_user_id: userId
        });

        if (error) {
            console.error('Error getting AI stats:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Exception in getAIUsageStats:', err);
        return [];
    }
}

/**
 * Get next midnight timestamp in Thailand timezone
 * @returns {string} ISO timestamp
 */
function getNextMidnight() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString();
}

/**
 * Format remaining messages message for user
 * @param {number} remaining - Remaining message count
 * @returns {string}
 */
export function formatLimitMessage(remaining) {
    if (remaining <= 0) {
        return '⚠️ คุณใช้ AI ครบโควต้าวันนี้แล้ว (120 ข้อความ) จะรีเซ็ตเที่ยงคืน';
    } else if (remaining <= 10) {
        return `⚠️ เหลือ AI ตอบได้อีก ${remaining} ข้อความวันนี้`;
    } else if (remaining <= 30) {
        return `ℹ️ เหลือ AI ตอบได้อีก ${remaining} ข้อความวันนี้`;
    }
    return null; // Don't show message if plenty remaining
}
