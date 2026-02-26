import Plot from 'react-plotly.js'
import * as Plotly from 'plotly.js-dist-min'

const Graph3d = ({ data }) => {
    // Check if data passed
    if (!data || data.length === 0) return <p className='mt-2 text-center text-[#313131]/60'>No data to plot</p>;

    // Surface data
    const surfaceData = [
        {
            x: data.y,
            y: data.x,
            z: data.z,
            type: 'surface',
            colorscale: 'Viridis',
            colorbar: {
                thickness: window.innerWidth < 640 ? 10 : 15,
                len: window.innerWidth < 640 ? 0.5 : 0.7,
                x: window.innerWidth < 640 ? 1.02 : 1.0,
                tickfont: {
                    size: window.innerWidth < 640 ? 8 : 10
                }
            }
        }
    ]

    return (
        <Plot
            data={surfaceData}
            layout={{  
                autosize: true,
                title: {
                    text: 'IV Surface Explorer',
                    font: {
                        size: window.innerWidth < 640 ? 14 : 16
                    }
                },
                scene: {
                    xaxis: { 
                        title: { 
                            text: 'Strike Price',
                            font: { size: window.innerWidth < 640 ? 10 : 12 }
                        }
                    },
                    yaxis: { 
                        title: { 
                            text: 'Time to Expiration (Years)',
                            font: { size: window.innerWidth < 640 ? 10 : 12 }
                        }
                    },
                    zaxis: { 
                        title: { 
                            text: 'Implied Volatility (%)',
                            font: { size: window.innerWidth < 640 ? 10 : 12 }
                        }
                    },
                    aspectmode: 'cube'
                },
                margin: {
                    l: window.innerWidth < 640 ? 0 : 50,
                    r: window.innerWidth < 640 ? 0 : 50,
                    t: window.innerWidth < 640 ? 40 : 60,
                    b: window.innerWidth < 640 ? 0 : 50
                }
            }}
            config={{ 
                responsive: true,
                displayModeBar: window.innerWidth >= 640
            }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
            plotly={Plotly}
        />
    )
}

export default Graph3d;