
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, orderBy, query, limit, where, doc, getDoc, updateDoc } from "firebase/firestore";

export interface TestRun {
    id?: string;
    url: string;
    timestamp: number;
    status: 'passed' | 'failed' | 'running';
    testSuiteName: string;
    steps: { action: string, status: string, error?: string }[];
    screenshotUrl?: string; // Optional URL or base64
    aiCritique?: {
        score: number;
        summary: string;
        suggestions: string[];
    };
}

const COLLECTION_NAME = "autopilot_runs";

export const testRunService = {
    // Create a new run record
    async createRun(run: Omit<TestRun, "id" | "timestamp">) {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...run,
                timestamp: Date.now()
            });
            return docRef.id;
        } catch (e) {
            console.error("Error creating test run:", e);
            throw e;
        }
    },

    // Update an existing run (e.g., adding AI analysis later)
    async updateRun(id: string, updates: Partial<TestRun>) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, updates);
        } catch (e) {
            console.error("Error updating test run:", e);
            throw e;
        }
    },

    // Get recent runs
    async getRecentRuns(limitCount = 20) {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy("timestamp", "desc"), limit(limitCount));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TestRun));
        } catch (e) {
            console.error("Error fetching runs:", e);
            return [];
        }
    },

    // Get single run detail
    async getRunById(id: string) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as TestRun;
            }
            return null;
        } catch (e) {
            console.error("Error fetching run:", e);
            return null;
        }
    }
};
