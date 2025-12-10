function ArticleTitle({ article, onClick }) {
    const created = article.createdAt ? new Date(article.createdAt) : null;

    return (
        <button className="article-title" onClick={onClick}>
            <div className="article-title__content">
                <h3 className="article-title__heading">{article.title}</h3>
                {created && <span className="article-title__date">{created.toLocaleString()}</span>}
            </div>
            <div className="article-title__arrow" aria-hidden>→</div>
        </button>
    );
}

export default ArticleTitle;
