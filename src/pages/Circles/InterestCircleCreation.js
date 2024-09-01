import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const CreateCircle = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/categories/');
                console.log('Categories response:', response.data);
    
                // Extract results array
                if (response.data && Array.isArray(response.data.results)) {
                    setCategories(response.data.results);
                } else {
                    throw new Error('Data is not in expected format');
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError(`Error fetching categories: ${err.message}`);
            }
        };
    
        fetchCategories();
    }, []);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('description', description.trim());
            formData.append('category', category);

            const response = await axios.post("/interest-circles/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Success:', response.data);
            history.push("/interest-circles");
        } catch (err) {
            console.error("Error creating interest circle:", err.response ? err.response.data : err.message);
            setError(`Error creating interest circle: ${err.message}`);
        }
    };

    return (
        <div className="p-6 lg:pr-20">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-700 leading-relaxed">
                Create Interest Circle
            </h1>
            {error && <p className="text-center text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Circle Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="4"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                        Category
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.type}</option>
                            ))
                        ) : (
                            <option disabled>No categories available</option>
                        )}
                    </select>
                </div>
                <div className="flex items-center justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition"
                    >
                        Create Circle
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCircle;
