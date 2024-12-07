import React, { useState, useEffect, useMemo } from 'react';
import './college-table.scss';

// 
import { initialColleges } from '../dummyData';
import { formatCurrency } from '../formatCurrency';
import { getOrdinalSuffix } from '../getOrdinalSuffix';

const CollegeTable = () => {

    // State
    const [allColleges, setAllColleges] = useState(initialColleges); // Full data set
    const [colleges, setColleges] = useState(initialColleges.slice(0, 10)); // Displayed data (first 10)
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [sortKey, setSortKey] = useState('ranking.rank');

    // Compute filtered colleges with useMemo
    const filteredColleges = useMemo(() => {
        return allColleges.filter((college) =>
            college.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allColleges, searchQuery]);

    // Infinite scroll handler
    const handleScroll = () => {
        if (
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 50 &&
            !loading &&
            colleges.length < filteredColleges.length
        ) {
            setLoading(true);
            setTimeout(() => {
                const nextItems = filteredColleges.slice(
                    colleges.length,
                    colleges.length + 10
                );
                setColleges((prev) => [...prev, ...nextItems]);
                setLoading(false);
            }, 1000);
        }
    };

    // Attach infinite scroll listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);

        // eslint-disable-next-line
    }, [colleges, filteredColleges, loading]);


    // Sorting function
    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...allColleges].sort((a, b) => {
            const aValue = key.includes('.') ? key.split('.').reduce((o, k) => o[k], a) : a[key];
            const bValue = key.includes('.') ? key.split('.').reduce((o, k) => o[k], b) : b[key];

            if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
            if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
            return 0;
        });

        setAllColleges(sortedData); // Update the full dataset
        setColleges(sortedData.slice(0, colleges.length)); // Update the displayed item
    };

    
    // Update displayed colleges on filter or search change
    useEffect(() => {
        setColleges(filteredColleges.slice(0, 10));
    }, [filteredColleges]);


    return (
        <div className='college-table-main-container'>
            <h2>College Table</h2>

            {/* Search Bar */}
            <div className="input-section">
                <input
                    type="text"
                    placeholder="Search by college name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="sort-by-sec">
                    <label for="sort-options">Sort by :</label>
                    <select
                        name="sort-options"
                        id="sort-options"
                        onChange={(event) => {
                            setSortKey(event.target.value)
                        }}
                    >
                        <option value="ranking.rank" selected>Rank</option>
                        <option value="fees">Fees</option>
                        <option value="userReviews.reviews">Reviews</option>
                        <option value="placement.highestPackage">Placement</option>
                    </select>
                    <button onClick={() => sortData(sortKey)}>
                        {sortConfig.key === sortKey && sortConfig.direction === 'ascending'
                            ? '↓'
                            : '↑'}
                    </button>
                </div>
            </div>

            <div className="table-main">
                {/* -----------------------------------Heading------------------------------------- */}

                <div className="table-heading">
                    <div className="heading rank-h"><p>S.No</p></div>
                    <div className="heading"><p>Colleges</p></div>
                    <div className="heading">
                        <p>Course Fees</p>

                    </div>
                    <div className="heading"><p>Placement</p></div>
                    <div className="heading">
                        <p>User Reviews</p>

                    </div>
                    <div className="heading">
                        <p>Ranking</p>

                    </div>
                </div>

                {/* -----------------------------------Body------------------------------------- */}
                <div className="table-body">
                    {colleges.map((college, i) => (
                        <div key={i} className='table-row'>
                            <div className='table-data rank-td'>#{i + 1}</div>
                            <div className='table-data college-name-td'>{college.name}</div>
                            <div className='table-data college-fee-td'>
                                <h3>{formatCurrency(college.fees)}</h3><br />
                                <p>BE/B.Tech <br />- 1st Year Fee</p>
                            </div>
                            <div className='table-data placement-td'>
                                <h3>
                                    {formatCurrency(college.placement.averagePackage)}
                                </h3>
                                <p>Average Package</p>
                                <br />

                                <h3>
                                    {formatCurrency(college.placement.highestPackage)}
                                </h3>
                                <p>Highest Package</p>
                            </div>
                            <div className='table-data user-review-td'>
                                <h3>{college.userReviews.rating.toFixed(1)}/10</h3>
                                <br />
                                <p>Based on {college.userReviews.reviews} user <br />reviews</p>
                            </div>
                            <div className='table-data ranking-td'>
                                <h3>{getOrdinalSuffix(college.ranking.rank)}/{college.ranking.outOfValue}</h3><br />
                                <p>in India 2024</p>
                            </div>
                        </div>
                    ))}
                </div>

                {loading && <p className='loading'>Loading more colleges...</p>}
            </div>
        </div>
    );
};

export default CollegeTable;
