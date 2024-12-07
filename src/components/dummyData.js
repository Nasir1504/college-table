
export const initialColleges = Array.from({ length: 50 }, (_, i) => {
    const rank = Math.floor(Math.random() * 50) + 1; // Random rank between 1 and 50
    const fees = Math.floor(Math.random() * 400000) + 100000; // Random fees
    const rating = (10 - rank / 5).toFixed(1); // Higher rank, higher rating
    const averagePackage = Math.floor((50 - rank) * 20000 + 300000); // Higher rank, higher average package
    const highestPackage = Math.floor((50 - rank) * 40000 + 500000); // Higher rank, higher highest package
    const reviews = Math.floor((50 - rank) * 20 + 100); // Higher rank, more reviews

    return {
        id: i + 1,
        name: `College ${i + 1}`,
        fees,
        userReviews: {
            rating: parseFloat(rating),
            reviews,
        },
        ranking: {
            rank,
            outOfValue: 50,
        },
        placement: {
            averagePackage,
            highestPackage,
        },
    };
});