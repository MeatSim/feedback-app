import { createContext, useEffect, useState } from "react";

const FeedbackContext = createContext();

export const FeedbackProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState([]);

    useEffect(()=> {
        fetchFeedback();
    }, [])

    //Fetch feedback
    const fetchFeedback = async () => {
        const response = await fetch('/feedback?_sort=id&_order=desc');
        const data = await response.json();

        setFeedback(data);
        setIsLoading(false);
    }

    const [feedbackEdit, setFeedbackEdit] = useState({
        item: {},
        edit: false
    });
    
    //Add feedback
    const addFeedback = async (newFeedback) => {
        const response = await fetch('/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newFeedback)
        });

        const data = await response.json();

        setFeedback([data, ...feedback])
    }

    //Delete feedback
    const deleteFeedback = async (id) => {
        if(window.confirm('Are you sure you want to delete?')) {
            await fetch(`/feedback/${id}`, { method: 'DELETE' });

            setFeedback(feedback.filter((item) => item.id !== id))
        }
    }

    //Update feedback item
    const updateFeedback = async (id, updatedFeedback) => {
        const response = await fetch(`/feedback/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedFeedback)
        });

        const data = await response.json();

        const feedbackIndex = feedback.findIndex(f => f.id === id);
        const feedbackCopy = feedback.slice();
        feedbackCopy.splice(feedbackIndex, 1, data);
        setFeedback(feedbackCopy);
        // setFeedback(
        //     feedback.map(item => (item.id === id
        //         ? {...item, ...updatedFeedback}
        //         : item))
        // )
    }

    //set item to be updated
    const editFeedback = (item) => {
        setFeedbackEdit({
            item,
            edit: true
        })
        
        // const newFeedback = [...feedback];
        // const index = newFeedback.findIndex(item => item.id === feedbackEdit.item.id);
        // newFeedback[index] = feedbackEdit.item;
        // setFeedback(newFeedback);
    }

    return <FeedbackContext.Provider value={{
        feedback,
        feedbackEdit,
        isLoading,
        addFeedback,
        deleteFeedback,
        updateFeedback,
        editFeedback,
    }}>
        {children}
    </FeedbackContext.Provider>
}

export default FeedbackContext