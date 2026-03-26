import Station from "@components/station/Station";

const App: React.FC = () => {
  return (
    <div className="min-h-screen  from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:max-w-7/10">
          <h1 className="text-3xl font-bold text-slate-900">
            수도권 지하철 실시간 도착 정보
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            수도권 지하철의 실시간 도착 정보를 확인하세요
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className=" mx-auto px-2 py-8 sm:px-6 lg:px-4 lg:max-w-7/10">
        <Station />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-600 text-center">
            출처: 서울 열린데이터 광장 ⓒ 2019. Seoul Metropolitan Government
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
