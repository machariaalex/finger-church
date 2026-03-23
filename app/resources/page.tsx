import { FaFilePdf, FaBookOpen, FaVideo, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';

const resources = [
  { _id: '1', title: 'New Testament Church Study Guide', description: 'A comprehensive guide to understanding the pattern of the New Testament church.', url: '#', type: 'pdf', category: 'Bible Study' },
  { _id: '2', title: 'Plan of Salvation', description: 'What does the Bible say about how to be saved? This resource breaks it down clearly.', url: '#', type: 'pdf', category: 'Evangelism' },
  { _id: '3', title: 'Daily Bible Reading Schedule', description: 'Follow along with this yearly Bible reading plan.', url: '#', type: 'pdf', category: 'Bible Study' },
  { _id: '4', title: 'Evidences of Christianity', description: 'Historical and logical evidences for the existence of God and truth of Christianity.', url: '#', type: 'article', category: 'Apologetics' },
  { _id: '5', title: 'Worship in the Church', description: 'Understanding the five acts of New Testament worship.', url: '#', type: 'article', category: 'Worship' },
  { _id: '6', title: 'Marriage and the Home', description: 'Biblical principles for building a godly home.', url: '#', type: 'pdf', category: 'Family' },
  { _id: '7', title: 'Introduction to Biblical Greek', description: 'Video series introducing the Greek language of the New Testament.', url: '#', type: 'video', category: 'Bible Study' },
  { _id: '8', title: 'How to Study the Bible', description: 'Practical methods for effective personal Bible study.', url: '#', type: 'article', category: 'Bible Study' },
];

const typeIcon: Record<string, React.ReactNode> = {
  pdf: <FaFilePdf className="text-red-500" />,
  article: <FaBookOpen className="text-blue-500" />,
  video: <FaVideo className="text-green-500" />,
};

const categories = [...new Set(resources.map(r => r.category))];

export default function ResourcesPage() {
  return (
    <div className="pt-16">
      <section className="bg-slate-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Resource Center</h1>
          <p className="text-slate-300 text-xl">Tools to help you grow in the knowledge of God's Word</p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          {categories.map(cat => (
            <div key={cat} className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-200">{cat}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.filter(r => r.category === cat).map(resource => (
                  <div key={resource._id} className="card p-5 flex items-start gap-4">
                    <div className="text-2xl flex-shrink-0 mt-1">{typeIcon[resource.type]}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 mb-1">{resource.title}</h3>
                      <p className="text-slate-500 text-sm mb-3">{resource.description}</p>
                      <a href={resource.url} className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 text-sm font-medium">
                        {resource.type === 'pdf' ? <><FaDownload /> Download PDF</> : <><FaExternalLinkAlt /> View Resource</>}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
