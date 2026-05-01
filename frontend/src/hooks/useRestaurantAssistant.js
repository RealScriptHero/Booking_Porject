import { useMemo, useState } from 'react';
import { sendChatMessage } from '../api';

export function useRestaurantAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I can help with reservations, menu, and table availability.'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sessionId = useMemo(() => {
    const value = localStorage.getItem('chatSessionId');
    if (value) return value;
    const generated = `session-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    localStorage.setItem('chatSessionId', generated);
    return generated;
  }, []);

  const sendMessage = async (content) => {
    const text = String(content || '').trim();
    if (!text || loading) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const response = await sendChatMessage({
        message: text,
        userId: currentUser?.id,
        sessionId,
        history: nextMessages
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: response.reply || 'How can I help?' }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: error.message || 'Sorry, I could not process your request right now.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    sendMessage
  };
}
