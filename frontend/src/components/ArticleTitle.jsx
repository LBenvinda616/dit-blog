// ArticleTitle component: standardized title rendering with origin badge.
// Props:
// - title: string; article headline
// - origin: 'user' | 'automated'; used to color-code the badge
function ArticleTitle({ article, onClick }) {
    const created = article.createdAt ? new Date(article.createdAt) : null;
    const origin = article.origin === 'automated' ? 'automated' : 'user';
    const badgeText = origin === 'automated' ? '100% bot-made' : 'User prompt';
    const badgeClass = origin === 'automated' ? 'pill pill--bot' : 'pill pill--user';

    return (
        <button className="article-title" onClick={onClick}>
            <div className="article-title__content">
                <h3 className="article-title__heading">{article.title}</h3>
                <div className="article-title__meta">
                    <span className={badgeClass}>{badgeText}</span>
                    {created && <span className="article-title__date">{created.toLocaleString()}</span>}
                </div>
            </div>
            <div className="article-title__arrow" aria-hidden>→</div>
        </button>
    );
}

export default ArticleTitle;
