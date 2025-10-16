"use client";
import { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

type Client = {
  id: string;
  userId: string;
  fullName: string;
  email: string | null;
  status: string;
  createdAt: string;
};


export default function Clients() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"active" | "paused" | "inactive">(
    "active"
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<
    Array<{
      id: string;
      fullName: string;
      email?: string | null;
      status: "active" | "paused" | "inactive";
      createdAt: string;
    }>
  >([]);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getClients = async () => {
    const res = await fetch("/api/supabase-clients", { cache: "no-store" });
    if (!res.ok) throw new Error(`GET failed: ${res.status}`);
    const { clients } = await res.json();
    setClients(clients);
  };


  useEffect(() => {


    getClients()

  }, [])


  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/supabase-clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName,
          email,
          status,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed : ${res.status}`);
      }

      const { client } = await res.json()

      await getClients()

      return client

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unkown error submitting form";

      console.error("SubmitForm Error:", message)
      return null
    }

  };


  const updateClient = async (id: string, updates: Record<string, any>) => {
    try {
      const res = await fetch(`/api/supabase-clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const data = await res.json();
      console.log("Updated client:", data.client);

      // Optionally re-fetch client list
      await getClients();

    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const deleteClient = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;

    try {

      const res = await fetch(`/api/supabase-clients/${id}`, {
        method: "DELETE"
      })

      await res.json();
      setIsModalOpen(false);

      await getClients();


    } catch (error) {

      console.error("Delete error:", error)

    }
  }


  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8 dark:bg-gray-900">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-1/2 -z-10 aspect-1155/678 w-144.5 max-w-none -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-288.75 dark:opacity-20"
        />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl dark:text-white">
          Add Client
        </h2>
        <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-400">
          Aute magna irure deserunt veniam aliqua magna enim voluptate.
        </p>
      </div>
      <form onSubmit={submitForm} className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="fullName"
              className="block text-sm/6 font-semibold text-gray-900 dark:text-white"
            >
              Full name
            </label>
            <div className="mt-2.5">
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                placeholder="e.g., Jonathan Doe"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm/6 font-semibold text-gray-900 dark:text-white"
            >
              Email
            </label>
            <div className="mt-2.5">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="status"
              className="block text-sm/6 font-semibold text-gray-900 dark:text-white"
            >
              Status
            </label>
            <div className="mt-2.5">
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "active" | "paused" | "inactive")
                }
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:focus:outline-indigo-500"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
          >
            Add Client
          </button>
        </div>
      </form>

      <div className="mx-auto mt-12 max-w-xl space-y-3">
        {clients.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No clients yet.
          </p>
        ) : (
          clients.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                setSelectedClient(c);
                setIsModalOpen(true);
              }}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 dark:text-white">
                  {c.fullName}
                </p>
                <span className="text-xs uppercase tracking-wide rounded-full px-2 py-1 border dark:border-white/20">
                  {c.status}
                </span>
              </div>
              {c.email && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {c.email}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                Added {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      {isModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit Client
            </h3>
            <button
              type="button"
              onClick={() => deleteClient(selectedClient.id)}
              className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              title="Delete client"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
            <form
              onSubmit={async (e) => {
                console.log(selectedClient)
                e.preventDefault();

                await updateClient(selectedClient.id, selectedClient)
                await getClients()


                setIsModalOpen(false);
                setSelectedClient(null);
              }}
            >
              <div className="space-y-3">
                <input
                  type="text"
                  value={selectedClient.fullName}
                  onChange={(e) =>
                    setSelectedClient({
                      ...selectedClient,
                      fullName: e.target.value,
                    })
                  }
                  className="w-full rounded-md border px-3 py-2 text-gray-900 dark:bg-white/5 dark:text-white"
                  placeholder="Full name"
                />
                <input
                  type="email"
                  value={selectedClient.email ?? ""}
                  onChange={(e) =>
                    setSelectedClient({
                      ...selectedClient,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-md border px-3 py-2 text-gray-900 dark:bg-white/5 dark:text-white"
                  placeholder="Email"
                />
                <select
                  value={selectedClient.status}
                  onChange={(e) =>
                    setSelectedClient({
                      ...selectedClient,
                      status: e.target.value as
                        | "active"
                        | "paused"
                        | "inactive",
                    })
                  }
                  className="w-full rounded-md border px-3 py-2 text-gray-900 dark:bg-white/5 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedClient(null);
                  }}
                  className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}