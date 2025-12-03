"use client";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import { AuthProvider } from "./providers/AuthProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
