import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import '../../css/fishery.css';
import FisheryHeader from '../../components/FisheryHeader';


export default function Fishery() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Fishery';
    navigate('/fishery/pool');
  }, [])

  return (
    <>
      <FisheryHeader />
    </>
  );
}
