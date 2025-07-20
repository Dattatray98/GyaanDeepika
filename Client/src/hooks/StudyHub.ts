import axios from "axios";
import type { StudyHub } from "../components/Common/Types";

const fetchStudyHub = async (setStudyHub: (data: StudyHub[]) => void) => {
    try {
        const api = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${api}/api/StudyHub`);
        const studyHubData = response.data.map((item: any) => ({
            id: item._id,
            title: item.title,
            type: item.type,
            examType: item.examType,
            subject: item.subject,
            year: item.year,
            downloads: item.downloads,
            rating: item.rating,
            description: item.description,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }));
        setStudyHub(studyHubData);
    } catch (error) {
        console.error("Failed to fetch study hub:", error);
    }
};


export default fetchStudyHub;
