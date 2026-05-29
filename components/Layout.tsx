import React, { ReactNode } from "react";
import { ToolType } from "../types";

interface LayoutProps {
  children: ReactNode;
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  onBackHome: () => void;
}

const NavItem = ({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out group relative overflow-hidden ${
      active
        ? "bg-thai-50 text-thai-700 font-semibold shadow-sm ring-1 ring-thai-100 translate-x-1"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1 hover:shadow-sm"
    }`}
  >
    <span
      className={`transition-colors duration-300 transform group-hover:scale-110 ${active ? "text-thai-600" : "text-gray-400 group-hover:text-gray-600"}`}
    >
      {icon}
    </span>
    <span className="z-10">{label}</span>
    {active && (
      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-thai-500 animate-pulse"></div>
    )}
  </button>
);

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeTool,
  onToolChange,
  onBackHome,
}) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-200 h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        <div className="p-6 flex items-center justify-center border-b border-gray-100 h-24">
          <div
            className="w-auto h-12 flex items-center justify-center cursor-pointer"
            onClick={onBackHome}
          >
            <img
              src="https://blogger.googleusercontent.com/img/a/AVvXsEhB1jpcQk1Mv4dSAMVANfT3P02RvrPWTRkco3dsyHtzwXOBNKsRYwLFlVFcvjzIAUzVJLC8nfQJES1jLUICTc7kL2R3KXhlk0A3fIedrldq4S6mPUyplGxvntW1P-MMKk2S3jY3EGDyMS1GUzgjSj63CdAG2y7wpNjO0IK5ZQy-Wcx9SYZ9jTkeGq8Z0QU"
              alt="Shwe Thai"
              className="h-full w-auto object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="px-4 py-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            AI Creative Studio
          </div>

          <NavItem
            label="Content Creator"
            active={activeTool === ToolType.CONTENT_BUILDER}
            onClick={() => onToolChange(ToolType.CONTENT_BUILDER)}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            }
          />
          <NavItem
            label="TikTok Script Writer"
            active={activeTool === ToolType.TIKTOK_SCRIPT}
            onClick={() => onToolChange(ToolType.TIKTOK_SCRIPT)}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            }
          />
          <NavItem
            label="Health Article Writer"
            active={activeTool === ToolType.HEALTH_ARTICLE}
            onClick={() => onToolChange(ToolType.HEALTH_ARTICLE)}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            }
          />
          <NavItem
            label="Image Generator"
            active={activeTool === ToolType.IMAGE_GENERATION}
            onClick={() => onToolChange(ToolType.IMAGE_GENERATION)}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />

          <div className="mt-8 px-4 py-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            Strategy & Assets
          </div>
          <NavItem
            label="CMO Consultant"
            active={activeTool === ToolType.CONSULTATION}
            onClick={() => onToolChange(ToolType.CONSULTATION)}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 00-2-2V6a2 2 0 002-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            }
          />
          <NavItem
            label="Saved Content"
            active={activeTool === ToolType.SAVED_CONTENT}
            onClick={() => onToolChange(ToolType.SAVED_CONTENT)}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            }
          />
          <NavItem
            label="Thailand Calendar"
            active={activeTool === ToolType.CALENDAR}
            onClick={() => onToolChange(ToolType.CALENDAR)}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />


          <div className="mt-auto pt-6 border-t border-gray-100">
            <button
              onClick={onBackHome}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-300">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </span>
              <span className="font-medium">Back to Home</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#F9FAFB] flex flex-col relative">
        <div className="flex-grow p-4 md:p-10 max-w-[1600px] mx-auto w-full relative">
          {children}
        </div>
        <footer className="w-full py-6 text-center text-xs text-gray-400 border-t border-gray-100 bg-white mt-auto">
          <span>© 2026 Shwe Thai Marketing AI Studio</span>
          <span className="mx-2 text-gray-200">|</span>
          <span>
            Developed by{" "}
            <a
              href="https://julianevin.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-thai-600 hover:text-thai-700 font-semibold transition-colors underline decoration-dotted underline-offset-4"
            >
              Julian Evin
            </a>
          </span>
        </footer>
      </main>
    </div>
  );
};
