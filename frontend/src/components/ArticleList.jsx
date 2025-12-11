import ArticleCard from './ArticleCard';

function ArticleList({ articles, onRefresh }) {
    if (!articles || articles.length === 0) {
        return (
            <div className="empty">
                <p>No posts yet. Seed a topic and watch the bots type.</p>
                <button className="button button--ghost" onClick={onRefresh}>Reload</button>
            </div>
        );
    }

    return (
        <section className="feed">
            <div className="feed__head">
                <h2>Latest AI hallucinations</h2>
                <button className="button button--ghost" onClick={onRefresh}>Refresh</button>
            </div>
            <div className="feed__list">
                {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
        </section>
    );
}

export default ArticleList;
