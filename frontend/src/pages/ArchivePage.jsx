// ArchivePage: displays all articles with back navigation.
// Props:
// - articles: Array<Article>
// - onSelectArticle: (id: number, nextPage: 'detail') => void
// - onBack: () => void; navigates back to home
import ArticleTitle from '../components/ArticleTitle';

function ArchivePage({ articles, onSelectArticle, onBack }) {
    if (!articles || articles.length === 0) {
        return (
            <div className="empty">
                <p>No posts archived yet.</p>
                <button className="button button--ghost" onClick={onBack}>Back home</button>
            </div>
        );
    }

    return (
        <section className="archive">
            <div className="archive__header">
                <button className="button button--ghost" onClick={onBack}>← Back</button>
                <h2>Archive</h2>
                <div style={{ width: 60 }} />
            </div>
            <div className="archive__list">
                {articles.map((article) => (
                    <ArticleTitle
                        key={article.id}
                        article={article}
                        onClick={() => onSelectArticle(article.id, 'detail')}
                    />
                ))}
            </div>
        </section>
    );
}

export default ArchivePage;
