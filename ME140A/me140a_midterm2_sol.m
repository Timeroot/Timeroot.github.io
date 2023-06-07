step1 = predictCorrector([1,0], 0, 0.5)
step2 = predictCorrector(step1, 0.5, 0.5)
step2rk3 = rk3(step1, 0.5, 0.5)

%Takes [x,x'] as y, returns their derivatives [x',x'']
function yprime = f(y, t)
    x = y(1);
    xprime = y(2);
    xprime2 = -x - 3*x^3 - t^2;
    yprime = [xprime, xprime2];
end

%Does a step of predictor-corrector, from time t to t+h
function ycorr = predictCorrector(y, t, h)
    k1 = f(y,t);
    ypred = y + h*k1;
    k2 = f(ypred, t+h);
    ycorr = y + h*(k1+k2)/2;
end

%Does a step of 3rd order Runge-Kutte, from time t to t+h
function ycorr = rk3(y, t, h)
    k1 = f(y,t);
    ypred1 = y + h*k1/2;
    k2 = f(ypred1,t+h/2);
    ypred2 = y + h*(2*k2-k1);
    k3 = f(ypred2,t+h);
    ycorr = y + h*(k1+4*k2+k3)/6;
end