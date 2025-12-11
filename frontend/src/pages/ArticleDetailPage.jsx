// ArticleDetailPage: full view of a single article.
// Props:
// - article: Article | null; when null, renders a fallback
// - onBack: () => void; navigates back to previous list view
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
    const origin = article.origin === 'automated' ? 'automated' : 'user';
    const badgeText = origin === 'automated' ? '100% bot-made' : 'User prompt';
    const badgeClass = origin === 'automated' ? 'pill pill--bot' : 'pill pill--user';

    return (
        <article className="article-detail">
            <button className="button button--ghost article-detail__back" onClick={onBack}>← Back</button>
            <header className="article-detail__header">
                <h1>{article.title}</h1>
                <div className="article-detail__meta">
                    <span className={badgeClass}>{badgeText}</span>
                    {created && <span className="article-detail__date">{created.toLocaleString()}</span>}
                </div>
            </header>
            <div
                className="article-detail__content"
                dangerouslySetInnerHTML={{ __html: article.content }}
            />
        </article>
    );
}

export default ArticleDetailPage;
