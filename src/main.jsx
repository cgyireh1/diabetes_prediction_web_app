import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';

import HomePage from './Components/HomePage.jsx';
import UploadData from './Components/UploadData.jsx';
import Retrain from './Components/Retrain.jsx';
import RetrainModel from './Components/RetrainModel.jsx';
import DiabetesPredictionForm from './Components/PredictionForm.jsx';



const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/upload-data', element: <UploadData /> },
      {
        path: '/retrain',
        element: <Retrain />,
        children: [
          { path: 'model', 
            element: <RetrainModel/> 
          },
        ],
      },
      { 
        path: '/predict', 
        element: <DiabetesPredictionForm /> 
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>
);
