import axios from 'axios';
import type { SummaryResponse } from '../components/Common/Types';

export const handleGenerateSummary = async (
  token: string,
  courseId: string,
  contentId: string,
  setSummaryText: React.Dispatch<React.SetStateAction<string>>,
  setSummaryLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSummaryError: React.Dispatch<React.SetStateAction<string>>
) => {
  setSummaryLoading(true);
  setSummaryError('');

  try {
    const api = import.meta.env.VITE_API_URL;
    const response = await axios.post<SummaryResponse>(
      `${api}/api/summary/generate/${courseId}/${contentId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSummaryText(response.data.data.summaryText);
  } catch (error) {
    console.error(error);
    setSummaryError("Failed to generate summary.");
  } finally {
    setSummaryLoading(false);
  }
};

export const handleAskQuestion = async (
  token: string,
  question: string,
  courseId: string,
  contentId: string,
  setChatHistory: React.Dispatch<React.SetStateAction<{ sender: 'user' | 'ai'; text: string }[]>>,
  setQaLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setQaError: React.Dispatch<React.SetStateAction<string>>
) => {
  try {
    setQaLoading(true);
    setQaError('');

    const api = import.meta.env.VITE_API_URL;
    const response = await axios.post(
      `${api}/api/qa/ask`,
      {
        question,
        courseId,
        contentId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const answer = response.data?.answer;
    if (answer) {
      setChatHistory((prev) => [...prev, { sender: 'ai', text: answer }]);
    } else {
      setQaError("Unexpected response format from server.");
    }
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage =
          error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      }
    }
    setQaError(errorMessage);
  } finally {
    setQaLoading(false);
  }
};
