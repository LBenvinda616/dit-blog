import { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import ArticleTitle from './ArticleTitle';

function HomePage({ articles, onRefresh, onSelectArticle }) {
    const recentArticles = articles.slice(0, 3);

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
                <h2>Latest transmissions</h2>
                <button className="button button--ghost" onClick={onRefresh}>Refresh</button>
            </div>
            <div className="feed__list">
                {recentArticles.map((article) => (
                    <ArticleCard
                        key={article.id}
                        article={article}
                        onReadMore={() => onSelectArticle(article.id, 'detail')}
                    />
                ))}
            </div>
            {articles.length > 3 && (
                <div className="feed__more">
                    <button className="button button--ghost" onClick={() => onSelectArticle(null, 'archive')}>
                        View archive ({articles.length} total)
                    </button>
                </div>
            )}
        </section>
    );
}

export default HomePage;
