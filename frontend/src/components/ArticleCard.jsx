import { useState } from 'react';

function ArticleCard({ article, onReadMore }) {
    const created = article.createdAt ? new Date(article.createdAt) : null;
    const origin = article.origin === 'automated' ? 'automated' : 'user';
    const badgeText = origin === 'automated' ? '100% bot-made' : 'User prompt';
    const badgeClass = origin === 'automated' ? 'pill pill--bot' : 'pill pill--user';
    const stripHtml = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };
    const plainText = stripHtml(article.content);
    const snippet = plainText.slice(0, 280) + (plainText.length > 280 ? '...' : '');

    return (
        <article className="card card--preview">
            <div className="card__preview-header">
                <h3 className="card__title">{article.title}</h3>
                <div className="card__meta">
                    {created && <span className="card__date">{created.toLocaleString()}</span>}
                </div>
            </div>
            <div className="card__badge-row">
                <span className={badgeClass}>{badgeText}</span>
            </div>
            <p className="card__preview-text">{snippet}</p>
            {onReadMore && (
                <button className="card__read-more" onClick={onReadMore}>
                    Read more →
                </button>
            )}
        </article>
    );
}

export default ArticleCard;
