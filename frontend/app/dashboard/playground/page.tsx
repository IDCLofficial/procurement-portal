'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth as useAuthPublic } from '@/components/providers/public-service/AuthProvider';
import endpoints from '@/store/api/endpoints.const';

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
}

export default function PlaygroundPage() {
  const { token } = useAuthPublic();
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [body, setBody] = useState('');
  const [useAuth, setUseAuth] = useState(true);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const loadEndpoint = (endpoint: string, suggestedMethod: string = 'GET', requiresAuth: boolean = true) => {
    setUrl(endpoint);
    setMethod(suggestedMethod);
    setUseAuth(requiresAuth);
    setBody('');
    setResponse(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (useAuth && token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const fetchOptions: RequestInit = {
        method,
        headers,
      };

      if (method !== 'GET' && method !== 'HEAD' && body.trim()) {
        fetchOptions.body = body;
      }

      const res = await fetch(BASE_URL + url, fetchOptions);
      const data = await res.json();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>API Playground</CardTitle>
            <CardDescription>
              Test API endpoints relative to the base URL with optional authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-sm font-semibold mb-3">Familiar Endpoints</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(endpoints).sort((a, b) => a[0].localeCompare(b[0])).map(([key, value]) => (
                  <Button
                    key={key}
                    type="button"
                    variant="outline"
                    size="sm"
                    className='cursor-pointer'
                    onClick={() => loadEndpoint(String(value))}
                  >
                    {key}
                  </Button>
                ))}
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="url">API Endpoint</Label>
                  <Input
                    id="url"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="/endpoint"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="method">Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="body">Request Body (JSON)</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='{"key": "value"}'
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auth"
                  checked={useAuth}
                  onCheckedChange={setUseAuth}
                  disabled={!token}
                />
                <Label htmlFor="auth">
                  Use Authentication {token ? '(Token available)' : '(No token)'}
                </Label>
              </div>

              <Button type="submit" className='cursor-pointer' disabled={loading}>
                {loading ? 'Sending...' : 'Send Request'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-red-600 whitespace-pre-wrap">{error}</pre>
            </CardContent>
          </Card>
        )}

        {!!response && (
          <Card>
            <CardHeader>
              <CardTitle>Response</CardTitle>
              <CardDescription>
                Status: {response.status} {response.statusText}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Headers</h4>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {JSON.stringify(response.headers, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data</h4>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
