function ProjectDetailModal({ project, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6 py-10 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#0d0d18] border border-white/10 rounded-2xl p-8 max-w-lg w-full my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs font-medium bg-violet-500/10 border border-violet-500/20 text-violet-300 px-3 py-1 rounded-full">
            {project.category}
          </span>
          <button onClick={onClose} className="text-white/40 hover:text-white text-lg">✕</button>
        </div>

        <h2 className="text-white text-xl font-bold mb-2">{project.title}</h2>
        <p className="text-white/50 text-sm mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.split(',').map((tech, i) => (
            <span key={i} className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded">
              {tech.trim()}
            </span>
          ))}
        </div>

        <div className="space-y-1 text-sm text-white/50 mb-5">
          <p>Submitted by: <span className="text-white/70">{project.submitterName}</span></p>
          <p>Guided under: <span className="text-white/70">{project.guideName}</span></p>
          {project.teamMembers?.length > 0 ? (
            <p>Team: <span className="text-white/70">{project.teamMembers.map(m => m.name).join(', ')}</span></p>
          ) : (
            <p className="text-white/30">Solo project</p>
          )}
          <p className="text-white/30">{project.month} {project.year}</p>
        </div>

        <a
          href={project.gitLink}
          target="_blank"
          rel="noreferrer"
          className="block w-full text-center bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2.5 rounded-xl transition-all mb-3 text-sm"
        >
          View Repository →
        </a>

        {project.files?.length > 0 && (
          <div className="border-t border-white/5 pt-4">
            <p className="text-xs text-white/40 mb-2">Project Files</p>
            <div className="space-y-1.5">
              {project.files.map((file, i) => (
                <a
                  key={i}
                  href={`${import.meta.env.VITE_API_URL}${file.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  📄 {file.fileName}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectDetailModal;