import Station from "@components/station/Station";

const App: React.FC = () => {
  return (
    <div className="h-screen max-w-300 mx-auto from-slate-50 to-slate-100 px-2 sm:px-6 lg:px-4">
      {/* Header */}
      <header className="border-slate-200">
        <div className="py-6">
          <h1 className="text-2xl font-bold text-slate-900">
            수도권 지하철 실시간 도착 정보
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            수도권 지하철의 실시간 도착 정보를 확인하세요
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-4/6">
        <Station />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12">
        <div className="py-6 ">
          <a href="https://data.seoul.go.kr/dataList/OA-12764/F/1/datasetView.do">
            도착 데이터 출처
          </a>
          <span className="mx-2">|</span>
          <a href="https://github.com/peng-jo/react-metro">소스코드</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
