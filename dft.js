function dft(x) {

    let X = [];

    const N = x.length / 2 + 1; //over the Nyquist limit (+1 to have N/2+1 indexes)
    const dataPoints = x.length;

    for (let k = 0; k < N; k++) {
        let re = 0;
        let im = 0;

        for (let n = 0; n < dataPoints; n++) {
            //k= frequency
            let phi = TWO_PI * k * n / dataPoints;
            //correlating the input signal with each sine/cosine basis functions
            re += x[n] * cos(phi);
            im += x[n] * sin(phi);
        }
        //The difference occurs because the frequency domain is defined as a spectral density.
        //To convert the sinusoidal amplitudes into a spectral density, divide each amplitude by the bandwidth represented by each amplitude.
        //2/N
        //Each sample in the frequency domain can be thought of as being contained in a frequency band of width 2/N, expressed as a fraction of the total bandwidth.
        re = re / dataPoints * 2; //average out by the number of datapoints and *2 due to deleted samples over Nyquiest limit
        im = -1*im / dataPoints * 2;

        X[k] = {
            re: re,
            im: im,
            amp: Math.sqrt(re * re + im * im),
            phase: Math.atan2(im, re),
            freq: k
        };
    }

    //special cases
    X[0].re = X[0].re / 2;
    X[N - 1].re = X[N - 1].re / 2;
    X[0].amp = X[0].amp / 2;
    X[N - 1].amp = X[N - 1].amp / 2;



    return X;
}

class Complex {

    constructor(re,im){
        this.re=re;
        this.im=im;
    }
    add(c){
        this.re=this.re+c.re;

    }
    mult(c){
        //(a+bi)*(c+di)=(ac-bd)+(ad+bc)i
        const re=this.re*c.re-this.im*c.im;
        const im=this.re*c.im+this.im*c.re;
        return new Complex(re,im);

    }

}

function complexDFT(Curve2D) {

    let X = [];

    const N = Curve2D.length / 2 + 1; //over the Nyquist limit (+1 to have N/2+1 indexes)
    const dataPoints = Curve2D.length;

    for (let k = 0; k < N; k++) {
       
        let sum=new Complex(0,0);
        for (let n = 0; n < dataPoints; n++) {
            //k= frequency
            let phi = TWO_PI * k * n / dataPoints;
            const actDatapoint=new Complex(cos(phi),-sin(phi));
            //correlating the input signal with each sine/cosine basis functions
            sum.add(Curve2D[n].mult(actDatapoint));

           
            // 'sum.re += x[n] * cos(phi);
            // sum.im += x[n] * sin(phi);'
        }
        //The difference occurs because the frequency domain is defined as a spectral density.
        //To convert the sinusoidal amplitudes into a spectral density, divide each amplitude by the bandwidth represented by each amplitude.
        //2/N
        //Each sample in the frequency domain can be thought of as being contained in a frequency band of width 2/N, expressed as a fraction of the total bandwidth.
        sum.re = sum.re / dataPoints * 2; //average out by the number of datapoints and *2 due to deleted samples over Nyquiest limit
        sum.im = -1*sum.im / dataPoints * 2;

        X[k] = {
            re:sum.re,
            im: im,
            amp: Math.sqrt(re * re + im * im),
            phase: Math.atan2(im, re),
            freq: k
        };
    }

    //special cases
    X[0].re = X[0].re / 2;
    X[N - 1].re = X[N - 1].re / 2;
    X[0].amp = X[0].amp / 2;
    X[N - 1].amp = X[N - 1].amp / 2;



    return X;
}