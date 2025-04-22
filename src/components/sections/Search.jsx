import React, {useState} from 'react'
import {nasaApi} from "../../data/nasaAPI.jsx";



const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!query.trim()) return;

        setLoading(true);
        setError(null);

        try {
            if (results) {
               setResults([]);
            }
            const data = await nasaApi.searchMedia(query);
            if ( !data.collection.items.length) {
                setError("Failed to fetch any data")
            }
            setResults(data.collection.items || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }


    return (
        <main className="flex flex-col justify-center items-center mt-48">
           <form onSubmit={handleSearch} className="search flex flex-col gap-8 items-center">
               <div className="search__box">
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search For NASA media..." className="search-input px-4" type="text"/>
               </div>
               <div className="search__options text-4xl flex justify-center gap-3">
                   <div className="search__option">
                       <input className="option-input" type="checkbox" name="audio" id="audio" value="audio"/>
                       <label htmlFor="audio">Audio</label>
                   </div>
                   <div className="search__option">
                       <input className="option-input" type="checkbox" name="image" id="image" value="image"/>
                       <label htmlFor="image">Image</label>
                   </div>
                   <div className="search__option">
                       <input className="option-input" type="checkbox" name="video" id="video" value="video"/>
                       <label htmlFor="video">Video</label>
                   </div>
               </div>
           </form>
            <div className="results grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-8">
                {loading && <div className="loading flex gap-4 items-center text-6xl col-span-full">
                    <div role="status">
                        <svg aria-hidden="true"
                             className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"/>
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>Loading</div>}
                {error && <div className="error text-6xl col-span-full">{error}</div>}

                {results.map((item, index) => (
                    <div  className=" flex flex-col gap-8 items-center text-center" key={index}>
                        {item.links && item.links[0]?.href && (
                            <img
                                onClick={() => console.log(item.data[0].nasa_id)}
                                src={item.links[0].href}
                                alt={item.data?.[0]?.title || 'NASA media'}
                            />
                        )}
                        <div className="result-info">
                            <h3>{item.data?.[0]?.title || 'Untitled'}</h3>
                            <p>{item.data?.[0]?.description?.substring(0, 100)}...</p>
                            <p className="date">{item.data?.[0]?.date_created?.split('T')[0]}</p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}
export default Search
