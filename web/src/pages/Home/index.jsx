import { React, useEffect, useState } from 'react';
import { Watermark } from 'antd';

const Home = () => {
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

    useEffect(() => {
      const handleResize = () => {
        setViewportHeight(window.innerHeight);
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    return (
        <main>
            <div>
                <Watermark content="Em desenvolvimento">
                    <div
                        style={{
                        height: viewportHeight,
                        }}
                    />
                </Watermark>
            </div>
        </main>
    )
}

export default Home;