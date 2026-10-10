"""
Extra experiments for the Activation Functions tutorial (Tutorial 3).
Same network, data split and optimizer as the notebook, but logging the
training loss per epoch so the convergence curves can be compared, plus
gradient-flow measurements at different depths.

Usage:  python activation_experiments.py  (expects ./data/FashionMNIST)
Outputs: results.json, curves.png
"""
import json, time
import numpy as np
import torch, torch.nn as nn, torch.nn.functional as F
import torch.utils.data as data
import torch.optim as optim
from torchvision.datasets import FashionMNIST
from torchvision import transforms

DATASET_PATH = "./data"
EPOCHS = 15
torch.set_num_threads(max(1, torch.get_num_threads()))


def set_seed(s):
    np.random.seed(s); torch.manual_seed(s)


# ---------------- activation functions (same as notebook) ----------------
class Act(nn.Module):
    def __init__(self): super().__init__(); self.name = self.__class__.__name__
class Sigmoid(Act):
    def forward(self, x): return 1 / (1 + torch.exp(-x))
class Tanh(Act):
    def forward(self, x): return torch.tanh(x)
class ReLU(Act):
    def forward(self, x): return x * (x > 0).float()
class LeakyReLU(Act):
    def forward(self, x): return torch.where(x > 0, x, 0.1 * x)
class ELU(Act):
    def forward(self, x): return torch.where(x > 0, x, torch.exp(x) - 1)
class Swish(Act):
    def forward(self, x): return x * torch.sigmoid(x)

ACTS = {"sigmoid": Sigmoid, "tanh": Tanh, "relu": ReLU,
        "leakyrelu": LeakyReLU, "elu": ELU, "swish": Swish}


class BaseNetwork(nn.Module):
    def __init__(self, act_fn, hidden_sizes=(512, 256, 256, 128)):
        super().__init__()
        sizes = [784] + list(hidden_sizes); layers = []
        for i in range(1, len(sizes)):
            layers += [nn.Linear(sizes[i - 1], sizes[i]), act_fn]
        layers += [nn.Linear(sizes[-1], 10)]
        self.layers = nn.Sequential(*layers)
    def forward(self, x): return self.layers(x.view(x.size(0), -1))


# ---------------- data ----------------
tf = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])
set_seed(42)
full = FashionMNIST(root=DATASET_PATH, train=True, transform=tf, download=True)
train_set, val_set = data.random_split(full, [50000, 10000])
test_set = FashionMNIST(root=DATASET_PATH, train=False, transform=tf, download=True)

# preload into tensors for speed
def to_tensor(ds):
    xs, ys = zip(*[ds[i] for i in range(len(ds))])
    return torch.stack(xs), torch.tensor(ys)
Xtr, Ytr = to_tensor(train_set); Xva, Yva = to_tensor(val_set); Xte, Yte = to_tensor(test_set)


def accuracy(net, X, Y):
    net.eval()
    with torch.no_grad():
        return (net(X).argmax(-1) == Y).float().mean().item()


def grad_stats(net):
    """Mean |grad| of every weight matrix for one batch of 256 images."""
    net.train(); net.zero_grad()
    F.cross_entropy(net(Xtr[:256]), Ytr[:256]).backward()
    return [p.grad.abs().mean().item() for n, p in net.named_parameters() if "weight" in n]


def dead_fraction(net):
    """Fraction of hidden neurons that output exactly 0 for every training image."""
    net.eval(); dead = None
    with torch.no_grad():
        h = Xtr.view(Xtr.size(0), -1); res = []
        for layer in net.layers[:-1]:
            h = layer(h)
            if isinstance(layer, Act): res.append((h == 0).all(0).float().mean().item())
    return res


def train(net, epochs=EPOCHS, bs=256):
    opt = optim.SGD(net.parameters(), lr=1e-2, momentum=0.9)
    hist = {"train_loss": [], "val_acc": [], "first_epoch_loss": []}
    n = Xtr.size(0)
    for ep in range(epochs):
        net.train(); perm = torch.randperm(n); losses = []
        for i in range(0, n - bs + 1, bs):
            idx = perm[i:i + bs]
            opt.zero_grad()
            loss = F.cross_entropy(net(Xtr[idx]), Ytr[idx])
            loss.backward(); opt.step()
            losses.append(loss.item())
            if ep == 0: hist["first_epoch_loss"].append(loss.item())
        hist["train_loss"].append(float(np.mean(losses)))
        hist["val_acc"].append(accuracy(net, Xva, Yva))
    hist["test_acc"] = accuracy(net, Xte, Yte)
    return hist


results = {"shallow": {}, "deep": {}}
DEEP = [256] * 5 + [128] * 5

for name, cls in ACTS.items():
    t0 = time.time()
    # 1) gradient flow at init, 4 hidden layers vs 10 hidden layers
    set_seed(42); g4 = grad_stats(BaseNetwork(cls()))
    set_seed(42); g10 = grad_stats(BaseNetwork(cls(), DEEP))
    # 2) training curves, notebook architecture
    set_seed(42); net = BaseNetwork(cls()); h = train(net)
    h["grad_init"] = g4; h["dead_after_training"] = dead_fraction(net)
    results["shallow"][name] = h
    # 3) training curves, 10 hidden layers
    set_seed(42); netd = BaseNetwork(cls(), DEEP)
    dead_init = dead_fraction(netd)
    hd = train(netd)
    hd["grad_init"] = g10; hd["dead_init"] = dead_init
    results["deep"][name] = hd
    print(f"{name:10s} 4L test={h['test_acc']:.4f}  10L test={hd['test_acc']:.4f}  "
          f"({time.time()-t0:.0f}s)", flush=True)

json.dump(results, open("results.json", "w"), indent=1)
