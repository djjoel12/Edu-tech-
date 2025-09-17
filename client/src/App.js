
  
 
          
     
        


     
                      

                        
                         
                                 
                                              
                                                           
                                               
                                               
                                                                                  
                                                                                              
                                                                                                      

                                                                                    
                                                                                                                         
                                                                                                                                
                                                                                                                                                
                                                                                                                                                      




                     // src/App.js

                     import React from "react";
                     import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
                     import HomePagePremium from "./components/HomePagePremium";
                     import SchoolRegisterForm from "./components/SchoolRegisterForm"; // 👈 ton formulaire d’inscription

                     function App() {
                       return (
                           <Router>
                                 <div className="min-h-screen bg-gray-100">
                                         {/* Barre de navigation simple */}
                                                 <nav className="p-4 bg-indigo-600 text-white flex justify-between">
                                                           <h1 className="font-bold">Mon SaaS Scolaire</h1>
                                                                     <div className="space-x-4">
                                                                                 <Link to="/" className="hover:underline">
                                                                                               Accueil
                                                                                                           </Link>
                                                                                                                       <Link to="/register" className="hover:underline">
                                                                                                                                     Inscrire une école
                                                                                                                                                 </Link>
                                                                                                                                                           </div>
                                                                                                                                                                   </nav>

                                                                                                                                                                           {/* Routes */}
                                                                                                                                                                                   <Routes>
                                                                                                                                                                                             <Route path="/" element={<HomePagePremium />} />
                                                                                                                                                                                                       <Route path="/register" element={<SchoolRegisterForm />} />
                                                                                                                                                                                                               </Routes>
                                                                                                                                                                                                                     </div>
                                                                                                                                                                                                                         </Router>
                                                                                                                                                                                                                           );
                                                                                                                                                                                                                           }

                                                                                                                                                                                                                           export default App;
                                                                                                                                                                                                                           