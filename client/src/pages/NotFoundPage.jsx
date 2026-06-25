import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-4">
    <h1 className="text-6xl font-bold text-primary">404</h1>
    <p className="mt-2 text-muted-foreground">This page doesn't exist.</p>
    <Button className="mt-6" asChild><Link to="/">Go home</Link></Button>
  </div>
);

export default NotFoundPage;
