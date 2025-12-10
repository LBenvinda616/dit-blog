function ArticleDetailPage({ article, onBack }) {
    if (!article) {
        return (
            <div className="empty">
                <p>Article not found.</p>
                <button className="button button--ghost" onClick={onBack}>Back</button>
            </div>
        );
    }

    const created = article.createdAt ? new Date(article.createdAt) : null;

    return (
        <article className="article-detail">
            <button className="button button--ghost article-detail__back" onClick={onBack}>← Back</button>
            <header className="article-detail__header">
                <h1>{article.title}</h1>
                {created && <span className="article-detail__date">{created.toLocaleString()}</span>}
            </header>
            <div
                className="article-detail__content"
                dangerouslySetInnerHTML={{ __html: article.content }}
            />
        </article>
    );
}

export default ArticleDetailPage;
