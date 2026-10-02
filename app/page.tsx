export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-5xl font-bold text-blue-600">
        SplitMate
      </h1>

      <p className="mt-4 text-gray-600">
        Expense tracking and bill splitting app
      </p>

      <div className="mt-8 flex gap-4">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          Create Group
        </button>

        <button className="border border-gray-300 px-6 py-3 rounded-lg">
          View Expenses
        </button>
      </div>
    </main>
  );
}